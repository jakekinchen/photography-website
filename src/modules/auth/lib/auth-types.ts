export type Session = {
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    userAgent: string | null;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export type User = Session["user"];
