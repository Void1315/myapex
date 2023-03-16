import React from 'react';
import Head from 'next/head';
import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '../components/Link';
import DrawerLayout from '../layouts/DrawerLayout'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

const CfgConfig = () => {
  const { activeRouteKey } = useSelector((state: RootState) => state.global)
  return <DrawerLayout routeActiveKey={activeRouteKey}><CfgConfigContent/></DrawerLayout>
}

function CfgConfigContent() {
  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript-material-ui)</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Material-UI
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          with Nextron
        </Typography>
        <Typography gutterBottom>
          <Link href="/home">Go to the home page</Link>
        </Typography>
        <Button variant="contained" color="primary">
          Do nothing button
        </Button>
      </div>
    </React.Fragment>
  );
};

export default CfgConfig;
