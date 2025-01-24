export interface ImageVote {
    id: number;
    userId: string;
    imageId: number;
    like: boolean;
    createdAt: Date;
}

export interface CreateImageVoteDTO {
    userId: string;
    imageId: number;
    like: boolean;
}


export interface UpdateImageVoteDTO {
    userId: string;
    imageId: number;
    like: boolean;
}