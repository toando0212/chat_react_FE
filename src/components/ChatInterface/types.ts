export type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export type Model = {
  name: string;
  value: string;
};
