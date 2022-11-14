import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ipcRenderer } from 'electron'

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
  const handleClick = () => {
    ipcRenderer.send('selectApexDir')
  };

  useEffect(() => {
    ipcRenderer.addListener('selectedApexDir', (event, name) => {
      setApexRoot(name)
    })
    ipcRenderer.addListener('loadCfg', (e, loadCfgData) => {
      setChildCfg(loadCfgData.childCfg)
    })
    return () => {
      ipcRenderer.removeAllListeners('selectedApexDir')
      ipcRenderer.removeAllListeners('loadCfg')
    }
  }, [setApexRoot])
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
      <ChildCfgList childCfg={childCfg} />
    </Container>
  );
};

const ChildCfgList = ({ childCfg }) => {
  const classes = useStyles({});
  const changeChildCfgStatus = (e: React.ChangeEvent<HTMLInputElement>, _value) => {
    // console.log('changeChildCfgStatus', e.target.name)
    ipcRenderer.send('changeChildCfgStatus', {
      name: e.target.name,
      value: _value
    })
  }
  return <Grid container>
    {childCfg?.map?.(item => {
      return (<Grid key={item.name} container item justifyContent="space-between" alignItems="center" className={classes.childCfgItem}>
        <Grid item>
          <Typography>{item.title}</Typography>
        </Grid>
        <Grid item>
          <Switch name={item.name} defaultChecked={item.status} onChange={changeChildCfgStatus} />
        </Grid>
        <Grid item>
          <Button disabled variant="contained" color="primary">高级功能</Button>
        </Grid>
      </Grid>)
    })}


  </Grid>
}
export default Home;
