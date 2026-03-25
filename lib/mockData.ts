import { Course, Assignment, Message, User } from './types';

export const currentUser: User = {
  id: 'u1',
  name: '田中 健太',
  role: 'student',
  avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=User',
};

export const adminUser: User = {
  id: 'a1',
  name: '佐藤 結衣',
  role: 'admin',
  avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=Admin',
};

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'AI時代のデジタル・エディトリアル戦略',
    description: 'プロンプトエンジニアリングを活用した高度な記事構成案の作成方法について学びます。',
    thumbnail: 'https://placehold.co/600x400/e2e8f0/475569?text=Course+1',
    progress: 65,
    totalLessons: 24,
    completedLessons: 15,
    category: 'AI Writing'
  },
  {
    id: 'c2',
    title: 'データサイエンス入門：Python基礎',
    description: 'データ分析に必要なPythonの基本文法とライブラリの使い方を習得します。',
    thumbnail: 'https://placehold.co/600x400/e2e8f0/475569?text=Course+2',
    progress: 12,
    totalLessons: 18,
    completedLessons: 2,
    category: 'Data Science'
  },
  {
    id: 'c3',
    title: 'UXデザインの極意：プロレベルのUI構築',
    description: 'ユーザーの心を動かすインターフェース設計の原則と実践。',
    thumbnail: 'https://placehold.co/600x400/e2e8f0/475569?text=Course+3',
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    category: 'Design'
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
    senderAvatar: 'https://placehold.co/150x150/e2e8f0/475569?text=AI',
    content: '✨ あなたの学習傾向を分析しました。週末にまとめて学習する傾向があるため、平日に15分の復習時間を設けることをお勧めします。',
    timestamp: '昨日',
    isUnread: false,
    type: 'system'
  }
];

export const mockStudents = [
  {
    id: 'stu1',
    name: '田中 健太',
    email: 'kenta.tanaka@example.com',
    avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=Student',
    enrolledCourses: 3,
    progress: 65,
    lastActive: '今日 14:30',
    status: 'active'
  },
  {
    id: 'stu2',
    name: '鈴木 美咲',
    email: 'misaki.suzuki@example.com',
    avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=Student',
    enrolledCourses: 5,
    progress: 82,
    lastActive: '昨日 09:15',
    status: 'active'
  },
  {
    id: 'stu3',
    name: '高橋 大輔',
    email: 'daisuke.takahashi@example.com',
    avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=Student',
    enrolledCourses: 2,
    progress: 15,
    lastActive: '3日前',
    status: 'inactive'
  },
  {
    id: 'stu4',
    name: '渡辺 さくら',
    email: 'sakura.watanabe@example.com',
    avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=Student',
    enrolledCourses: 4,
    progress: 45,
    lastActive: '今日 10:00',
    status: 'active'
  },
  {
    id: 'stu5',
    name: '伊藤 誠',
    email: 'makoto.ito@example.com',
    avatar: 'https://placehold.co/150x150/e2e8f0/475569?text=Student',
    enrolledCourses: 1,
    progress: 0,
    lastActive: '1週間前',
    status: 'inactive'
  }
];
