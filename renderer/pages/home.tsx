import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles'
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

const Home = () => {
  const { activeRouteKey } = useSelector((state: RootState) => state.global)
  return <DrawerLayout routeActiveKey={activeRouteKey}><HomeContent/></DrawerLayout>
}

function HomeContent() {
  const classes = useStyles({});

  return (
    <>
      
    </>
  );
};

export default Home;
