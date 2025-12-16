import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos modulo Tema (E2E)', () => {
  let token: any;
  let usuarioId: any;
  let temaId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

    afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar um novo Usuario e Logar', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201);

    usuarioId = resposta.body.id;

      const respostaToken = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = respostaToken.body.token;
  });

/*
  it('02 - Deve autenticar o Usuario (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });
*/
    it('03 - Deve Cadastrar um novo tema', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/temas')
      .set('Authorization', `${token}`)
      .send({
        descricao: 'tema',
      })
      .expect(201);

    temaId = resposta.body.id;
  });

  it('04 - Deve Listar todos os Temas', async () => {
    return await request(app.getHttpServer())
      .get('/temas')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('05 - Deve buscar um Tema pela descricao', async () => {
    return request(app.getHttpServer())
      .get('/temas/descricao/tema')
      .set('Authorization', `${token}`)
      .expect(200)
      .then( resposta => {
        expect('tema').toEqual(resposta.body[0].descricao);
      });
  });


  it('06 - Deve Atualizar um Tema', async () => {
    return request(app.getHttpServer())
      .put('/temas')
      .set('Authorization', `${token}`)
      .send({
        id: temaId,
        descricao: 'tema atualizado',
      })
      .expect(201)
      .then( resposta => {
        expect('tema atualizado').toEqual(resposta.body.descricao);
      });
  });

    it('07 - Deve Deletar um Tema', async () => {
      return request(app.getHttpServer())
        .delete(`/temas/${temaId}`)
        .set('Authorization', `${token}`)
        .expect(204);
    });


});
