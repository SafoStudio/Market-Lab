import { ProductModel } from './types/product.type'
import { CreateProductDto, UpdateProductDto } from './types/product.dto'

export class ProductDomainEntity implements ProductModel{
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ){}

    static create(dto: CreateProductDto): ProductDomainEntity{
        return new ProductDomainEntity(
            '', // ID autogenerate in DB 
            dto.name,
            dto.description,
            dto.price
        );
    };

    update(dto: UpdateProductDto): void{
       if(dto.name) this.name = dto.name;
       if(dto.description) this.description = dto.description;
       if(dto.price) this.price = dto.price;
       this.updatedAt = new Date();
    }
}