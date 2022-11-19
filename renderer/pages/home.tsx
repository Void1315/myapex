import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import useStyles from './homeStyles'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ipcRenderer } from 'electron'
import { Tooltip, TextField, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Settings, Help } from '@material-ui/icons';
function Home() {
  const classes = useStyles({});
  const [apexRoot, setApexRoot] = useState('')
  const [childCfg, setChildCfg] = useState([])
  const handleClick = async () => {
    ipcRenderer.invoke('openApexDir').then((data) => {
      console.log('data', data)
      const { path, cfgData } = data ?? {}
      setApexRoot(path)
      setChildCfg(cfgData.childCfg)
    })

  };

  return (
    <Container maxWidth="sm">
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
      <ChildCfgForm defaultChildCfg={childCfg} />
    </Container>
  );
};
type TcfgData = {
  name: string,
  title: string,
  status: boolean
}[]


const ChildCfgForm = ({ defaultChildCfg }) => {
  const [cfgData, setCfgData] = useState<TcfgData>(defaultChildCfg)
  const classes = useStyles({});
  const changeChildCfgStatus = (e, _value, index) => {
    ipcRenderer.invoke('changeChildCfgStatus', {
      name: e.target.name,
      value: _value
    }).then(() => {
      cfgData[index].status = _value
      setCfgData([...cfgData])
    }).catch(err => console.error(err))
  }

  useEffect(() => {
    setCfgData([...defaultChildCfg])
  }, [defaultChildCfg])

  return <Grid container>
    <ChildCfgFormItem></ChildCfgFormItem>
    {cfgData?.map?.((item, index) => {
      return (<Grid key={item.name} container item justifyContent="space-between" alignItems="center" className={classes.childCfgItem}>
        <Grid item>
          <Typography>{item.title}</Typography>
        </Grid>
        <Grid item>
          <Switch key={item.status + item.name} name={item.name} checked={item.status} inputProps={{ 'aria-label': 'controlled' }} onChange={(e, value) => changeChildCfgStatus(e, value, index)} />
        </Grid>
        <Grid item>
          <Button disabled={!item.status} variant="contained" color="primary">高级功能</Button>
        </Grid>
      </Grid>)
    })}
  </Grid>
}


const ChildCfgFormItem = () => {
  const classes = useStyles({});
  const CfgTitle = () => {
    return (
      <Grid container alignItems='center'>
        <Grid item style={{ marginRight: 12 }}>
          <span className={classes.childCfgTitle}>{"一键SG"}</span>
        </Grid>
        <Grid item>
          <Switch color="primary" />
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

  const FormCfgChildConfig = ({ type }) => {

    return <Grid>
      {
        type === "number" && <TextField
          id="standard-number"
          label="最大fps"
          type="number"
          variant="outlined"
          size="small"
          style={{ width: 180 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      }
      {
        type === "key" && <FormControl size="small" variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">请选择启动键</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select"
            label="请选择启动键"
            style={{ minWidth: 180 }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      }
    </Grid>
  }

  const CfgAdvancedSettings = () => {
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

        <Grid style={{marginBottom: 16}} container item justifyContent="space-between" alignItems='center' xs={12} >
          <FormLabel title="启动键" tooltipText="按下此键，才能开始cfg操作" />
          <FormCfgChildConfig type={'key'} />
        </Grid>

        <Grid  container item justifyContent="space-between" alignItems='center' xs={12} >
          <FormLabel title="最小fps" tooltipText="sg时，会降低fps增加成功率" />
          <FormCfgChildConfig type={'number'} />
        </Grid>
      </Grid>
      
    </Grid>
  }
  return (<>
    <Grid container className={classes.childCfgFormItemBox}>
      <CfgTitle />
      <Grid container item style={{ padding: 8 }}>
        <CfgAdvancedSettings />
      </Grid>
    </Grid>
  </>)
}

export default Home;
