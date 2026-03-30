
export interface packageDetails {
    id: number
    image: string
    name: string
    mplanCode: string
    operator: string
    status: 'active' | 'inactive'
    description: string
    duration: string
    channelCount: number
}