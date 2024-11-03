import React from 'react';
import { Button, Flex, Typography, Row, Col } from 'antd';
import { Avatar, Card } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

const DashboardPresentationList = ({ presentations }) => {
  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={3} strong>
          Your Presentation List
        </Typography.Title>
        <Button type="link">
          View All
        </Button>
      </Flex>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {presentations.map((presentation) => (
          <Col
            key={presentation.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card
              style={{ width: '100%', aspectRatio: '2 / 1', minWidth: '100px' }}
              cover={
                <div
                  style={{
                    backgroundColor: presentation.thumbnail ? 'transparent' : '#ccc',
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {presentation.thumbnail ? (
                    <img
                      alt={presentation.name}
                      src={presentation.thumbnail}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '80%', height: '80%', backgroundColor: 'gray' }}></div>
                  )}
                </div>
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={presentation.name}
                description={
                  <>
                    <div>{presentation.description || 'No description available'}</div>
                    <div>Slides: {presentation.numSlides}</div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default DashboardPresentationList;