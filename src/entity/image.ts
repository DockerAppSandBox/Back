export interface Image {
    id: number;
    imageData: string;
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
  }
  
  export interface CreateImageDTO {
    imageData: string;
  }
  
  export interface UpdateImageDTO {
    imageData?: string;
    likesCount?: number;
    dislikesCount?: number;
  }