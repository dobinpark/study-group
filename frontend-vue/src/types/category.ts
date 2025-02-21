export interface Category {
    id?: number;
    name: string;
    mainCategory?: string;
    subCategory?: string;
    detailCategory?: string;
    count?: number;
    subCategories: SubCategory[];
    // 필요한 Category 인터페이스 속성들을 추가하세요.
}

export interface SubCategory {
    name: string;
    items?: string[];
}
