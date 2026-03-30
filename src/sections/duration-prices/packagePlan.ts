export interface PackagePlan {
    id: number
    packageId: number
    durationLabel: string
    priceINR: number
    priceLKR: number
    status: 'active' | 'inactive'
}