export interface Image {
    id: string;
    imageUrl: string;
    createdAt: Date;
    likesCount: number;
  }
  
  export interface CreateImageDTO {
    imageUrl: string;
  }
  
  export interface UpdateImageDTO {
    imageData?: string;
    likesCount?: number;
  }