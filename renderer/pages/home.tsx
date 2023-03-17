import React from 'react';
import DrawerLayout from '../layouts/DrawerLayout'
import { Typography, Container, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import useStyles from '../styles/home'

const Home = () => {
  const { activeRouteKey } = useSelector((state: RootState) => state.global)
  return <DrawerLayout routeActiveKey={activeRouteKey}><HomeContent /></DrawerLayout>
}

function HomeContent() {
  const classes = useStyles({});

  return (
    <Container maxWidth="md" sx={{ minWidth: 900 }}>
      <img src="/images/apex_img1.png" alt="" style={{
        borderRadius: 16,
        width: '100%',
        height: 285,
        marginBottom: 16
      }} />
      <Box sx={{
        cursor: "default",
        userSelect: 'none',
      }}>
        <Typography variant="h2" gutterBottom>
          APEX CFG 助手
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Typography variant="h4" gutterBottom >
            ——为了在外面玩省一堆步骤
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom >
            cfg相关视频——up <a href='https://space.bilibili.com/381799244'>Akane_oim</a>
          </Typography>
          <iframe width={"100%"} height={"600px"} src="//player.bilibili.com/player.html?aid=597778314&bvid=BV1JB4y1q7Wa&cid=755912369&page=1" allowFullScreen={true}> </iframe>

          <Typography variant="h6" gutterBottom >
            <a href='https://wwd.lanzoul.com/isSI506yhsfg' target="_blank">cfg文件下载</a>
          </Typography>
        </Box>
      </Box>



    </Container>
  );
};

export default Home;
