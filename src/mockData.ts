import { Course, Assignment, Message, User } from './types';

export const currentUser: User = {
  id: 'u1',
  name: '田中 健太',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100',
};

export const adminUser: User = {
  id: 'a1',
  name: '佐藤 結衣',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
};

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'AI時代のデジタル・エディトリアル戦略',
    description: 'プロンプトエンジニアリングを活用した高度な記事構成案の作成方法について学びます。',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    progress: 65,
    totalLessons: 24,
    completedLessons: 15,
    category: 'AI Writing'
  },
  {
    id: 'c2',
    title: 'データサイエンス入門：Python基礎',
    description: 'データ分析に必要なPythonの基本文法とライブラリの使い方を習得します。',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    progress: 12,
    totalLessons: 18,
    completedLessons: 2,
    category: 'Data Science'
  },
  {
    id: 'c3',
    title: 'UXデザインの極意：プロレベルのUI構築',
    description: 'ユーザーの心を動かすインターフェース設計の原則と実践。',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600',
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
    senderAvatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=100&h=100',
    content: '✨ あなたの学習傾向を分析しました。週末にまとめて学習する傾向があるため、平日に15分の復習時間を設けることをお勧めします。',
    timestamp: '昨日',
    isUnread: false,
    type: 'system'
  }
];
