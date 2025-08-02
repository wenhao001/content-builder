import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, Statistic, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Chart, Skeleton } from '@components/ui';
import { Button as AntdButton } from 'antd';
import { getDashboardData as getDashboardStats } from '@services/dashboardService';
import { getRecentMaterials } from '@services/materialService';
import { MaterialDTO } from '../types/material';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  dashboardPage: {
    // 页面容器样式
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  actionButtons: {
    // 操作按钮容器样式
  },
  welcomeCard: {
    marginBottom: '1.5rem',
  },
  welcomeContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    // 欢迎文本样式
  },
  welcomeActions: {
    // 欢迎操作按钮样式
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
  statCard: {
    // 统计卡片样式
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  statIcon: {
    // 统计图标样式
  },
  statValue: {
    // 统计值样式
  },
  statFooter: {
    marginTop: '1rem',
  },
  statTrend: {
    // 统计趋势样式
  },
  statLabel: {
    // 统计标签样式
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  chartContainer: {
    // 图表容器样式
  },
  chartSkeleton: {
    // 图表骨架屏样式
  },
  noData: {
    // 无数据样式
  },
  tableContainer: {
    // 表格容器样式
  },
  materialIcon: {
    // 素材图标样式
  },
  storageProgressContainer: {
    // 存储进度容器样式
  },
  storageProgressFill: {
    // 存储进度填充样式
  },
}));

// 定义仪表盘数据类型
interface DashboardData {
  totalMaterials: number;
  materialGrowth: number;
  storageUsed: number;
  storageTotal: number;
  storagePercentage: number;
  totalContent: number;
  contentGrowth: number;
  totalDownloads: number;
  downloadGrowth: number;
  materialTypeStats: Record<string, number>;
  uploadTrend: {
    date: string;
    count: number;
  }[];
}

// 定义上传趋势项类型
interface UploadTrendItem {
  date: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const { styles } = useStyles();
  
  // 获取仪表盘统计数据
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  // 获取最近上传的素材
  const { data: recentMaterials, isLoading: isMaterialsLoading } = useQuery({
    queryKey: ['recentMaterials'],
    queryFn: () => getRecentMaterials(5),
  });

  // 格式化日期
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  // 获取素材类型对应的图标
  const getMaterialTypeIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'image': return 'fa-image';
      case 'video': return 'fa-video-camera';
      case 'audio': return 'fa-music';
      case 'text': return 'fa-file-text';
      default: return 'fa-file';
    }
  };

  // 素材类型分布图表数据（使用模拟数据）
  const materialTypeData = {
    labels: ['图片', '视频', '音频', '文档'],
    datasets: [
      {
        label: '素材数量',
        data: [12, 19, 3, 5],
        backgroundColor: [
          '#0ea5e9', // primary
          '#a855f7', // secondary
          '#10b981', // success
          '#f59e0b', // warning
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  // 近期上传趋势图表数据（使用模拟数据）
  const uploadTrendData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '上传数量',
        data: [12, 19, 3, 5, 2, 3, 8],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.pageHeader}>
        <h1>控制台</h1>
        <div className={styles.actionButtons}>
          <AntdButton type="primary">
            <Link to="/materials/upload">
              <i className="fa fa-upload mr-2"></i>上传素材
            </Link>
          </AntdButton>
        </div>
      </div>

      {/* 欢迎信息 */}
      <div className={styles.welcomeCard}>
        <Card>
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeText}>
              <h2>欢迎回来！</h2>
              <p className="text-neutral-500">
                今天是 {format(new Date(), 'yyyy年MM月dd日')}，这是您的内容管理概览
              </p>
            </div>
            <div className={styles.welcomeActions}>
              <AntdButton>
                <Link to="/content/create">
                  <i className="fa fa-magic mr-2"></i>创建内容
                </Link>
              </AntdButton>
            </div>
          </div>
        </Card>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        {/* 总素材数 */}
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>总素材数</h3>
              <div className={`${styles.statIcon} bg-primary-100 p-2 rounded-full`}>
                <i className="fa fa-database text-primary-600"></i>
              </div>
            </div>
            <div className={styles.statValue}>
              {isStatsLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <Statistic value={statsData?.totalMaterials || 0} prefix="" />
              )}
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.statTrend} text-success`}>
                <i className="fa fa-arrow-up mr-1"></i>{statsData?.thisMonthMaterials || 0}%
              </span>
              <span className={`${styles.statLabel} text-sm text-neutral-500`}>
                本月新增
              </span>
            </div>
          </div>
        </Card>

        {/* 存储空间使用 */}
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>存储空间</h3>
              <div className={`${styles.statIcon} bg-secondary-100 p-2 rounded-full`}>
                <i className="fa fa-cloud text-secondary-600"></i>
              </div>
            </div>
            <div className={styles.statValue}>
              {isStatsLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <Statistic
                  value={12.5}
                  suffix="GB"
                />
              )}
            </div>
            <div className={styles.statFooter}>
              <div className={styles.storageProgressContainer}>
                <div
                  className={styles.storageProgressFill}
                  style={{ width: '65%' }}
                ></div>
              </div>
              <span className={styles.statLabel}>
                共 50GB，已使用 65%
              </span>
            </div>
          </div>
        </Card>

        {/* 内容数量 */}
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>已创建内容</h3>
              <div className={`${styles.statIcon} bg-success-100 p-2 rounded-full`}>
                <i className="fa fa-file-text text-success-600"></i>
              </div>
            </div>
            <div className={styles.statValue}>
              {isStatsLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <Statistic value={24} prefix="" />
              )}
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.statTrend} text-success`}>
                <i className="fa fa-arrow-up mr-1"></i>{(statsData as unknown as DashboardData)?.contentGrowth || 0}%
              </span>
              <span className={`${styles.statLabel} text-sm text-neutral-500`}>
                较上月
              </span>
            </div>
          </div>
        </Card>

        {/* 素材下载量 */}
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>总下载量</h3>
              <div className={`${styles.statIcon} bg-warning-100 p-2 rounded-full`}>
                <i className="fa fa-download text-warning-600"></i>
              </div>
            </div>
            <div className={styles.statValue}>
              {isStatsLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <Statistic value={statsData?.pendingApprovals || 0} prefix="" />
              )}
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.statTrend} text-success`}>
                <i className="fa fa-arrow-up mr-1"></i>{(statsData as unknown as DashboardData)?.downloadGrowth || 0}%
              </span>
              <span className={`${styles.statLabel} text-sm text-neutral-500`}>
                较上月
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className={styles.chartsGrid}>
        {/* 素材类型分布 */}
        <Card>
          <div className={styles.cardHeader}>
            <h2>素材类型分布</h2>
          </div>
          <div className={styles.chartContainer}>
            {isStatsLoading ? (
              <div className={styles.chartSkeleton}>
                <Skeleton className="h-64 w-full" />
              </div>
            ) : materialTypeData ? (
              <Chart
                type="doughnut"
                data={materialTypeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                  cutout: '65%',
                }}
                height={300}
              />
            ) : (
              <div className={styles.noData}>暂无数据</div>
            )}
          </div>
        </Card>

        {/* 上传趋势 */}
        <Card>
          <div className={styles.cardHeader}>
            <h2>近期上传趋势</h2>
          </div>
          <div className={styles.chartContainer}>
            {isStatsLoading ? (
              <div className={styles.chartSkeleton}>
                <Skeleton className="h-64 w-full" />
              </div>
            ) : uploadTrendData ? (
              <Chart
                type="line"
                data={uploadTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
                height={300}
              />
            ) : (
              <div className={styles.noData}>暂无数据</div>
            )}
          </div>
        </Card>

        {/* 菜单访问统计 */}
        <Card>
          <div className={styles.cardHeader}>
            <h2>菜单访问统计</h2>
          </div>
          <div className={styles.chartContainer}>
            {isStatsLoading ? (
              <div className={styles.chartSkeleton}>
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <Chart
                type="bar"
                data={{
                  labels: ['内容生成', '素材管理', '系统设置', '个人资料'],
                  datasets: [
                    {
                      label: '访问次数',
                      data: [120, 85, 60, 45],
                      backgroundColor: [
                        '#0ea5e9',
                        '#a855f7',
                        '#10b981',
                        '#f59e0b',
                      ],
                      borderWidth: 0,
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
                height={300}
              />
            )}
          </div>
        </Card>
      </div>

      {/* 最近素材 */}
      <Card>
        <div className={styles.cardHeader}>
          <h2>最近上传的素材</h2>
          <AntdButton type="link">
            <Link to="/materials">查看全部</Link>
          </AntdButton>
        </div>
        <div className={styles.tableContainer}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isStatsLoading ? (
                // 加载状态骨架屏
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (recentMaterials as unknown as { items: MaterialDTO[] })?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa fa-folder-open-o text-4xl text-neutral-300"></i>
                      <p className="text-neutral-500">没有上传的素材</p>
                      <AntdButton>
                        <Link to="/materials/upload">上传素材</Link>
                      </AntdButton>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (recentMaterials as unknown as { items: MaterialDTO[] })?.items?.map((material: MaterialDTO) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`${styles.materialIcon} bg-primary-100 p-2 rounded-md`}>
                          <i className={`fa ${getMaterialTypeIcon(material.materialType)} text-primary-600`}></i>
                        </div>
                        <Link
                          to={`/materials/${material.id}`}
                          className="font-medium hover:text-primary-600"
                        >
                          {material.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="badge bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                        {material.materialType}
                      </span>
                    </TableCell>
                    <TableCell>
                      1.2 MB
                    </TableCell>
                    <TableCell>
                      {formatDate(material.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <AntdButton type="link" size="small">
                          <Link to={`/materials/${material.id}`}>
                            <i className="fa fa-eye mr-1"></i>查看
                          </Link>
                        </AntdButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;