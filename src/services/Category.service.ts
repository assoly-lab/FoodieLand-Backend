import { BadRequestError, NotFoundError } from "@/core/errors/AppErrors";
import { Category, CategoryImage } from "@/interfaces/Category.interface";
import { CategoryRepository } from "@/repositories/Category.repository";


export class CategoryService {
  private baseUrl ;
  private categoryRepository: CategoryRepository;
  
  constructor(){
    this.baseUrl = "upload/categories";
    this.categoryRepository = new CategoryRepository();
  }
  
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
  
  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if(!category){
      throw new NotFoundError("Category not found")
    }
    return category
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findByName(name);
    if(!category){
      throw new NotFoundError("Category not found")
    }
    return category
  }
  
  async create(file: Express.Multer.File, data: Partial<Category>): Promise<Category> {
    if(data.name){
      const existingCategory = await this.categoryRepository.findByName(data.name);
      if(existingCategory){
        throw new BadRequestError("Category with the same name already exist");
      }
    }
    if(!file){
      throw new BadRequestError("Category image is required");
    }
    
    const image: CategoryImage = {
      name: file.filename,
      url: `${process.env.HOST_URL}/${this.baseUrl}/${file.filename}`
    }
    const categoryData = {
      ...data,
      image,
    }
    return await this.categoryRepository.create(categoryData);
  }
  
  async update(id: string, file: Express.Multer.File, data: Partial<Category>): Promise<Category> {
    let image: CategoryImage = {
      name: "",
      url: ""
    };
    
    if(file){
      image.name = file.filename;
      image.url = `${process.env.HOST_URL}/${this.baseUrl}/${file.filename}`
    }
    
    const categoryPayload = {
      ...data,
      ...(image.name ? {image: image} : {}),
      updatedAt: new Date()
    }
    
    const category = await this.categoryRepository.update(id, categoryPayload);
    if(!category){
      throw new NotFoundError("Category not found");
    }
    return category;
  }
  
  async delete(id: string): Promise<boolean> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return await this.categoryRepository.delete(id); 
  }
  
}