import React, { useEffect } from 'react';
import Head from 'next/head';
import useStyles from '../styles/homeStyles'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ipcRenderer } from 'electron'
import { Tooltip, TextField, Select, MenuItem, InputLabel, FormControl, ListSubheader } from '@mui/material';
import { Settings, Help, FileCopy } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import debounce from 'lodash/debounce'
import { KEY_MAP } from '../config'
import { clipboard } from 'electron'
import DrawerLayout from '../layouts/DrawerLayout'



const HomeContent = () => {
  const classes = useStyles({});
  const dispatch = useDispatch<AppDispatch>()
  const { apexRoot, steamCommand, originCommand } = useSelector((state: RootState) => state.home)
  const handleClick = async () => {
    ipcRenderer.invoke('openApexDir').then((data) => {
      console.log('openApexDir返回数据: ', data)
      const { path, cfgData: _cfgData } = data ?? {}
      ipcRenderer.invoke('getGameStartCommand').then((data) => {
        console.log('getGameStartCommand返回数据: ', data)
        const { steam, origin } = data || {}
        dispatch({ type: 'home/setState', payload: { steamCommand: steam, originCommand: origin } })
      })
      dispatch({ type: 'home/setState', payload: { apexRoot: path, cfgData: _cfgData } })
    })


  };

  return (
    <Container maxWidth="md" sx={{minWidth: 800}}>
      <Head>
        <title>APEX cfg 快捷调整工具</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          APEX cfg 快捷调整工具
        </Typography>
        <Grid>
          <img style={{ width: 150 }} src="/images/logo.png" />

        </Grid>

        <Typography gutterBottom>
          {!apexRoot && '请先选择Apex根目录'}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {apexRoot && <Grid container item xs={4} alignItems="center">
            <span>Apex目录:  {apexRoot}</span>
          </Grid>}

          <Grid item xs={8}>
            <Button variant="contained" color="secondary" onClick={handleClick}>
              {!apexRoot ? '选择Apex根目录' : '重新选择Apex根目录'}
            </Button>
          </Grid>

        </Grid>
      </div>
      <ChildCfgForm />
      {
        apexRoot && <Grid container style={{ margin: '16px 0' }} >
          <Grid container alignItems='center' justifyContent='space-between' style={{ margin: '8px 0' }}>
            <Grid item>
              <span >
                启动命令(steam平台): {steamCommand}
              </span>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={() => clipboard.writeText(steamCommand)} startIcon={<FileCopy />}>复制启动命令</Button>
            </Grid>
          </Grid>

          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item>
              <span >
                启动命令(origin平台): {originCommand}
              </span>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={() => clipboard.writeText(originCommand)} startIcon={<FileCopy />}>复制启动命令</Button>
            </Grid>
          </Grid>
        </Grid>

      }

    </Container>
  );
};
const Home = () => {
  const { activeRouteKey } = useSelector((state: RootState) => state.global)
  useEffect(()=>{
    console.log('activeRouteKey', activeRouteKey)

  }, [activeRouteKey])
  return <DrawerLayout routeActiveKey={activeRouteKey}><HomeContent/></DrawerLayout>
}

const ChildCfgForm = () => {
  return <Grid container>
    <ChildCfgFormItem></ChildCfgFormItem>
  </Grid>
}


const ChildCfgFormItem = () => {
  const classes = useStyles({});
  const dispatch = useDispatch<AppDispatch>()
  const { cfgData } = useSelector((state: RootState) => state.home)
  const changeCfgStatus = (e) => {
    const id = e.target.name
    const newValue = e.target.checked
    ipcRenderer.invoke('changeChildCfgStatus', {
      id,
      value: newValue
    }).then(() => {
      let _cfgData = cfgData.map(item => {
        if (item.id === id) {
          return { ...item, value: newValue }
        }
        return item
      })

      dispatch({ type: 'home/setState', payload: { cfgData: _cfgData } })

    }).catch(err => console.error(err))
  }


  const sendUpdateParams = debounce(({ cfgName, paramName, value }) => {
    console.log('发送', {
      cfgName,
      paramName,
      value
    })
    ipcRenderer.invoke('changeCfgParams', {
      cfgName,
      paramName,
      value
    }).then(() => {
      let _cfgData = cfgData.map(item => {
        if (item.id === cfgName) {
          return {
            ...item, child: item.child.map(_item => {
              if (_item.id === paramName)
                return { ..._item, value }
              return _item
            })
          }
        }
        return item
      })
      dispatch({ type: 'home/setState', payload: { cfgData: _cfgData } })

    }).catch(err => console.error(err))
  }, 300)

  const paramChange = (e) => {
    const newValue = e.target.value
    const name = e.target.name;
    const [cfgName, paramName] = (name as string).split('.')
    sendUpdateParams({
      value: newValue, cfgName,
      paramName,
    })
  }

  const CfgTitle = ({ cfg }) => {
    return (
      <Grid container alignItems='center'>
        <Grid item style={{ marginRight: 12 }}>
          <span className={classes.childCfgTitle}>{cfg.title}</span>
        </Grid>
        <Grid item>
          <Switch color="primary" name={cfg.id} checked={cfg.value} onChange={changeCfgStatus} />
        </Grid>
      </Grid>
    )
  }

  const FormLabel = ({ title, tooltipText }) => {
    return <Grid container item xs={2}><Tooltip title={<span style={{ fontSize: '14px' }}>{tooltipText}</span>} style={{ cursor: 'default', }} placement="top">
      <Grid container item alignItems='center'>
        <Typography variant="button">{title}</Typography>
        <Help style={{ fontSize: 14, marginLeft: 4 }} />
      </Grid>
    </Tooltip>
    </Grid>
  }

  const FormCfgChildConfig = ({ type, value, onChange, title, disabled, name }: any) => {
    const renderGroupKeys = (group) => {
      const items = group.keys.map(key => {
        return (
          <MenuItem key={key.value} value={key.value}>
            {key.name}
          </MenuItem>
        );
      });
      return [<ListSubheader style={{ cursor: 'default', }}>{group.group_name}</ListSubheader>, items];
    }
    return <Grid>
      {
        type === "number" && <TextField
          label={title}
          type="number"
          variant="outlined"
          name={name}
          size="small"
          defaultValue={parseInt(value)}
          onChange={onChange}
          style={{ width: 180 }}
          disabled={disabled}
          InputLabelProps={{
            shrink: true,
          }}
        />
      }
      {
        type === "key" && <FormControl size="small" variant="outlined">
          <InputLabel id={`label-${name}`}>请选择启动键</InputLabel>
          <Select
            labelId={`${`label-${name}`}`}
            name={name}
            label="请选择启动键"
            style={{ minWidth: 180 }}
            disabled={disabled}
            onChange={onChange}
            defaultValue={value}
          >
            {
              KEY_MAP?.map(key => renderGroupKeys(key))
            }
          </Select>
        </FormControl>
      }
    </Grid>
  }

  const CfgAdvancedSettings = ({ childCfg, disabled, parentId }) => {
    return <Grid container>
      <Grid container item alignItems='center' style={{
        color: 'gray',
        cursor: 'default',
        marginBottom: 12,
      }}>
        <Settings style={{
          fontSize: 13, fontWeight: 400, marginRight: 2
        }} /><Typography style={{
          fontSize: 13, fontWeight: 400,
        }}>{"高级设置"}</Typography>
      </Grid>
      {/* 到时候这里map */}
      <Grid container item >
        {/*  大伙都有启动键 */}
        {/* <Grid style={{ marginBottom: 16 }} container item justifyContent="space-between" alignItems='center' xs={12} >
          <FormLabel title="启动键" tooltipText="按下此键，才能开始cfg操作" />
          <FormCfgChildConfig name={`${parentId}.startKey`} type={'key'} disabled={disabled} onChange={paramChange} />
        </Grid> */}

        {
          childCfg?.map(item => <Grid key={item.id} style={{ marginBottom: 16 }} container item justifyContent="space-between" alignItems='center' xs={12} >
            <FormLabel title={item.title} tooltipText={item.document} />
            <FormCfgChildConfig name={`${parentId}.${item.id}`} type={item.type} value={item.value} title={item.title} disabled={disabled} onChange={paramChange} />
          </Grid>)
        }

      </Grid>

    </Grid>
  }
  return (<>
    <Grid container className={classes.childCfgFormItemBox}>
      {
        cfgData?.map(cfg => {
          return <React.Fragment key={cfg.id}><CfgTitle cfg={cfg} /><Grid container item style={{ padding: 8 }}>
            <CfgAdvancedSettings parentId={cfg.id} disabled={!cfg.value} childCfg={cfg.child} />
          </Grid></React.Fragment>
        })
      }
    </Grid>
  </>)
}

export default Home;
