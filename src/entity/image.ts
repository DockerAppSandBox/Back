export interface Image {
    id: number;
    imageData: Buffer;
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
}
export interface Image {
    id: number;
    imageData: Buffer;
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
}

export interface CreateImageDTO {
    imageData: Buffer;
}

export interface UpdateImageDTO {
    likesCount?: number;
    dislikesCount?: number;
}
