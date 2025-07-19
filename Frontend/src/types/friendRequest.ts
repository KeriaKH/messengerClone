export interface friendSuggest {
    _id: string
    name: string
    avatar: string
}

export interface friendRequest {
    _id: string
    sender: friendSuggest
    receiver: string
    createdAt: string
}