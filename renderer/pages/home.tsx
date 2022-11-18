import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ipcRenderer } from 'electron'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
      marginBottom: theme.spacing(4)
    },
    childCfgItem: {
      borderBottom: '1px solid #999',
      paddingBottom: 8,
    }
  })
);

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

  useEffect(()=>{
    setCfgData([...defaultChildCfg])
  }, [defaultChildCfg])

  return <Grid container>
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
export default Home;
