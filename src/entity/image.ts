export interface Image {
    id: number;
    imageData: Buffer;
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
}