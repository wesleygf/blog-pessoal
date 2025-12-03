import { Body, HttpCode, HttpException, HttpStatus, Injectable, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Postagem } from "../entities/postagem.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class PostagemService{

    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>){}

    async findAll(): Promise<Postagem[]> {
        return await this.postagemRepository.find()
    }

    async findById (id:number): Promise<Postagem> {
        const postagem = await this.postagemRepository.findOne({ 
            where: { id }
        })

        if(!postagem){
            throw new HttpException('Postagem nao encontrada', HttpStatus.NOT_FOUND);
        }

        return postagem;
    }

    async findByTitulo(titulo:string) : Promise<Postagem[]>{
        return await this.postagemRepository.find({
            where:{ 
                titulo: ILike(`%${titulo}%`) 
            }
        })
    }

    
    async create(postagem: Postagem): Promise<Postagem>{
        //const novaPostagem = this.postagemRepository.create(postagem); nao e necessario o salve ja funciona 
        return await this.postagemRepository.save(postagem);
    }

    async update(postagem: Postagem): Promise<Postagem>{
        
        let buscaPostagem : Postagem = await this.findById(postagem.id);

        if(!buscaPostagem || !postagem.id)
            throw new HttpException('Postagem nao encontrada', HttpStatus.NOT_FOUND);

        return await this.postagemRepository.save(postagem);
    }

    async delete(id: number): Promise<DeleteResult>{

        let buscaPostagem = await this.findById(id);

        if(!buscaPostagem){
            throw new HttpException('Postagem nao encontrada', HttpStatus.NOT_FOUND);
        }

        return await this.postagemRepository.delete(id);
    }
}