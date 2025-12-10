import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { Repository } from "typeorm";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";
import { Postagem } from "../../postagem/entities/postagem.entity";


@Injectable()
export class UsuarioService{
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ){}

    async findByUsuario(usuario: string): Promise<Usuario | null>{
        return this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            }
        });
    }

    async findAll(): Promise<Usuario[]>{
        return this.usuarioRepository.find({relations: {postagem: true}});
    }

    async findById(id: number): Promise<Usuario>{

        let usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: { postagem: true }
        });

        if(!usuario){
            throw new HttpException('Usuario nao encontrado', HttpStatus.NOT_FOUND);
        }

        return usuario;

    }

    async create(usuario: Usuario): Promise<Usuario>{

        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        if ( !buscaUsuario ){
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
            return await this.usuarioRepository.save(usuario);
        }

        throw new HttpException('Usuario ja existe', HttpStatus.BAD_REQUEST);
    }

    async update(usuario: Usuario): Promise<Usuario>{

        let updateUsuario: Usuario = await this.findById(usuario.id);
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        if(!updateUsuario){
            throw new HttpException('Usuario nao encontrado', HttpStatus.NOT_FOUND);
        }
        if(buscaUsuario && buscaUsuario.id !== usuario.id){
            throw new HttpException('O usuario (e-mail) ja esta sendo utilizado', HttpStatus.BAD_REQUEST);
        }

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return await this.usuarioRepository.save(usuario);
    }
}