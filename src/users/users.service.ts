import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { UpdateUserDto } from 'src/dto/user.dto';
import { UserWithoutPassword } from 'src/interfaces/user.interface';
import { SharedUserDatabse } from 'src/shared/shared-database';

@Injectable()
export class UsersService {

    constructor(){

    }

    async findAll(requestingUser: any): Promise<UserWithoutPassword[]>{

        this.validateAdminAccess(requestingUser, 'listar todos los usuarios');

        const activeUsers = SharedUserDatabse.getActiveUsers();

        return activeUsers.map(user => this.removePassword(user));
    }

    async findOne(id: number, requestingUser?: any): Promise<UserWithoutPassword>{

        const user = SharedUserDatabse.findById(id);

        if(!user){
            throw new NotFoundException(`Usuario no encontrado con ID ${id}`)
        }

        if(requestingUser && requestingUser.userId != id && requestingUser.role !== 'admin'){   
            throw new ForbiddenException('Solo puedes ver tu propio perfil o ser administrador')
        }

        return this.removePassword(user);

    }

    async search(criterio: any, requestingUser: any): Promise<UserWithoutPassword[]>{

        this.validateAdminAccess(requestingUser, 'listar todos los usuarios');

        let user = SharedUserDatabse.getActiveUsers();

        if(criterio.email){
            user = user.filter(u =>
                u.email.toLowerCase().includes(criterio.email.toLowerCase())
            );
        }

        if(criterio.name){
            user = user.filter(u =>
                u.name.toLowerCase().includes(criterio.name.toLowerCase())
            );
        }

        if(criterio.role){
            user = user.filter(u =>
                u.role === criterio.role
            );
        }

        return user.map(user => this.removePassword(user));
    }

    async update(id: number, updateUserDto: UpdateUserDto, requestingUser: any):Promise<UserWithoutPassword>{

        if(requestingUser && requestingUser.userId != id && requestingUser.role !== 'admin'){   
            throw new ForbiddenException('Solo puedes actualizar tu propio perfil o ser administrador')
        }

        const user = SharedUserDatabse.findById(id);

        if(!user){
            throw new NotFoundException(`Usuario no encontrado con ID ${id}`)
        }

        const updatedUser = SharedUserDatabse.updateUser(id, {
            ...updateUserDto,
            updatedAt: new Date()
        });

        if(!updatedUser){
            throw new NotFoundException(`Error al actualizar usuario conm id ${id}` )
        }

        return this.removePassword(updatedUser);

    }


    private validateAdminAccess(user: any, action: string): void{
        if(user.role !== 'admin'){
            throw new ForbiddenException(`Solo administradores puede ${action}`);
        }
    }

    private removePassword(user: any): UserWithoutPassword{
        const {  password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

}
