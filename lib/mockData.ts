import { Course, Assignment, Message, User, Student, MonthlyData, CoursePerformance, RecentActivity } from './types';

export const currentUser: User = {
  id: 'u1',
  name: '田中 健太',
  role: 'student',
  avatar: '/default-avatar.svg',
};

export const adminUser: User = {
  id: 'a1',
  name: '佐藤 結衣',
  role: 'admin',
  avatar: '/default-avatar.svg',
};

export const courseCategories = ['All', 'AI Writing', 'Data Science', 'Design', 'Marketing'] as const;

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'AI時代のデジタル・エディトリアル戦略',
    description: 'プロンプトエンジニアリングを活用した高度な記事構成案の作成方法について学びます。',
    thumbnail: 'https://placehold.co/600x400/e2e8f0/475569?text=Course+1',
    progress: 65,
    totalLessons: 24,
    completedLessons: 15,
    category: 'AI Writing',
    studentCount: 85,
  },
  {
    id: 'c2',
    title: 'データサイエンス入門：Python基礎',
    description: 'データ分析に必要なPythonの基本文法とライブラリの使い方を習得します。',
    thumbnail: 'https://placehold.co/600x400/e2e8f0/475569?text=Course+2',
    progress: 12,
    totalLessons: 18,
    completedLessons: 2,
    category: 'Data Science',
    studentCount: 62,
  },
  {
    id: 'c3',
    title: 'UXデザインの極意：プロレベルのUI構築',
    description: 'ユーザーの心を動かすインターフェース設計の原則と実践。',
    thumbnail: 'https://placehold.co/600x400/e2e8f0/475569?text=Course+3',
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    category: 'Design',
    studentCount: 45,
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'マーケティング分析レポート作成',
    dueDate: '今日中',
    status: 'pending',
    courseName: 'データサイエンス入門'
  },
  {
    id: 'a2',
    title: 'デザインシステムの構築演習',
    dueDate: '3日後',
    status: 'pending',
    courseName: 'UXデザインの極意'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'a1',
    senderName: '佐藤 結衣 (メンター)',
    senderAvatar: adminUser.avatar,
    content: '前回の課題のフィードバックを送りました。構成案の視点が非常に鋭いです。具体例をもう少し増やすとさらに説得力が増します。',
    timestamp: '12:45',
    isUnread: true,
    type: 'feedback'
  },
  {
    id: 'm2',
    senderId: 'sys',
    senderName: 'AI 学習アシスタント',
    senderAvatar: '/default-avatar.svg',
    content: '✨ あなたの学習傾向を分析しました。週末にまとめて学習する傾向があるため、平日に15分の復習時間を設けることをお勧めします。',
    timestamp: '昨日',
    isUnread: false,
    type: 'system'
  }
];

export const mockStudents: Student[] = [
  {
    id: 'stu1',
    name: '田中 健太',
    email: 'kenta.tanaka@example.com',
    avatar: '/default-avatar.svg',
    enrolledCourses: 3,
    progress: 65,
    lastActive: '今日 14:30',
    status: 'active'
  },
  {
    id: 'stu2',
    name: '鈴木 美咲',
    email: 'misaki.suzuki@example.com',
    avatar: '/default-avatar.svg',
    enrolledCourses: 5,
    progress: 82,
    lastActive: '昨日 09:15',
    status: 'active'
  },
  {
    id: 'stu3',
    name: '高橋 大輔',
    email: 'daisuke.takahashi@example.com',
    avatar: '/default-avatar.svg',
    enrolledCourses: 2,
    progress: 15,
    lastActive: '3日前',
    status: 'inactive'
  },
  {
    id: 'stu4',
    name: '渡辺 さくら',
    email: 'sakura.watanabe@example.com',
    avatar: '/default-avatar.svg',
    enrolledCourses: 4,
    progress: 45,
    lastActive: '今日 10:00',
    status: 'active'
  },
  {
    id: 'stu5',
    name: '伊藤 誠',
    email: 'makoto.ito@example.com',
    avatar: '/default-avatar.svg',
    enrolledCourses: 1,
    progress: 0,
    lastActive: '1週間前',
    status: 'inactive'
  }
];

export const monthlyStudentData: MonthlyData[] = [
  { month: '10月', students: 68 },
  { month: '11月', students: 82 },
  { month: '12月', students: 95 },
  { month: '1月', students: 88 },
  { month: '2月', students: 110 },
  { month: '3月', students: 128 },
];

export const coursePerformanceData: CoursePerformance[] = [
  { name: 'AI時代のデジタル・エディトリアル戦略', students: 85, avgProgress: 65, completionRate: 42, satisfaction: 4.8 },
  { name: 'データサイエンス入門：Python基礎', students: 62, avgProgress: 38, completionRate: 18, satisfaction: 4.5 },
  { name: 'UXデザインの極意：プロレベルのUI構築', students: 45, avgProgress: 22, completionRate: 8, satisfaction: 4.7 },
];

export const recentActivityData: RecentActivity[] = [
  { action: '田中 健太 がレッスン「プロンプトエンジニアリングの基礎」を完了', time: '10分前', type: 'complete' },
  { action: '鈴木 美咲 が課題「ペルソナ設定プロンプトの作成」を提出', time: '30分前', type: 'submit' },
  { action: '新規受講者 渡辺 さくら が「UXデザインの極意」に登録', time: '1時間前', type: 'enroll' },
  { action: '高橋 大輔 が3日間ログインしていません', time: '3時間前', type: 'warning' },
  { action: '伊藤 誠 が「データサイエンス入門」の受講を開始', time: '5時間前', type: 'enroll' },
];
