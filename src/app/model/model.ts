export interface ViewData {
  [key: string]: number;
}

export interface Post {
  title: string;
  desc: string;
  img: string;
  html: string;
  group: string;
  content: string;
  idcha: string;
  _id?: string;
  count?: number;
  view: ViewData;
}

export interface HomePost {
  _id: string;
  desc: string;
  title: string;
  img: string;
}

export interface HomePage {
  posts: {
    [key: string]: HomePost[];
  };
  order: number;
}

export interface GroupPost {
  group: string;
  title: string;
  _id?: string;
}

export interface GroupPosts {
  [key: string]: GroupPost[];
}

export interface LessonGroup {
  [key: string]: GroupPosts;
}

export interface Category {
  _id: string;
  img: string;
  desc: string;
  title: string;
  group: string;
  idparent: string;
}

export interface NavCategory {
  childs: NavCategory[];
  parent: Category;
}

export interface Comment {
  _id: string;
  username: string;
  email: string;
  html: string;
  like: number;
  id_post: string;
  reply: number;
  id_comment: string;
}

export interface CommentGroup {
  [key: string]: Comment[];
}
