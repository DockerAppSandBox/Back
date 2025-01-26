export interface ImageVote {
    id: string;
    userId: string;
    imageId: string;
    like: boolean;
    createdAt: Date;
}

export interface CreateImageVoteDTO {
    userId: string;
    imageId: string;
    like: boolean;
}


export interface UpdateImageVoteDTO {
    userId: string;
    imageId: string;
    like: boolean;
}