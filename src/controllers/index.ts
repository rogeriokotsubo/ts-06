import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import dotenv from 'dotenv';
import { env } from "process";

dotenv.config();
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export const JWT_SECRET = env.TOKEN_SECRET;

export interface UserData{
    name: string,
    email: string,
    password: string
}

export interface RegisterdUserData{
    id : string,
    email: string,
    name: string
}

export interface LoginData{
    email: string,
    password: string
}

export interface userId{
    id : string
}


abstract class Validator
{
    data : any;
    errors? : string;

    constructor(data : any)
    {
        this.data = data;
        this.errors = "";
    }
}

abstract class StringValidator extends Validator
{
    constructor(data : any)
    {
        super(data);
        if(typeof data != 'string') this.errors = 'Tipo Errado';
    }
}

abstract class RegexValidator extends StringValidator
{
    protected get regexp () : RegExp
    {
        return new RegExp('');
    }
    constructor(data : any)
    {
        super(data);
        if(this.errors) return;
        if(!this.regexp.test(data)) this.errors = 'Formato errado';
    }
}

class EmailValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^(\w{1,}\@\w{1,}\.\w{3}(\.\w{2}){0,1})$/gim;
    }
}

class NameValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^([a-z]{1,})([ ]{1}[a-z]{1,}){0,}$/gim;
    }
}

class PasswordValidator extends RegexValidator
{
    protected override get regexp ()
    {
        return /^\w{6,}$/gim;
    }
}

function getUUID( req : Request, res : Response){
    const userData : UserData = req.body;

    const valEmail = new EmailValidator(userData.email);
    const valName = new NameValidator(userData.name);
    const valPwd = new PasswordValidator(userData.password);

    if(valEmail.errors) return res.json(`email:${valEmail.errors}`);
    if(valName.errors) return res.json(`name:${valName.errors}`);
    if(valPwd.errors) return res.json(`password:${valPwd.errors}`);

    const registerdUserData : RegisterdUserData = {
        id: uuid(),
        email: userData.email,
        name: userData.name
    };

    return res.json(registerdUserData);
}

function login( req : Request, res : Response){

    const loginData : LoginData = req.body;
    const valEmail = new EmailValidator(loginData.email);
    const valPwd = new PasswordValidator(loginData.password);

    if(valEmail.errors) return res.json(`email:${valEmail.errors}`);
    if(valPwd.errors) return res.json(`password:${valPwd.errors}`);


    const id = uuid();
    const sessionId : userId = { id: id};
    const token = generateAccessToken(sessionId);
    const timer = 900000;
    try {
        res.cookie('token', token, { maxAge: timer, httpOnly: true });
        res.cookie('auth', true,{ maxAge: timer, httpOnly: false });
        res.status(200).json({id: id});
    }
    catch(e: any){
        res.status(403).json({message: e.message});        
    }
   
}

function update(req : Request, res : Response){
    const userData : UserData = req.body;

    const valEmail = new EmailValidator(userData.email);
    const valName = new NameValidator(userData.name);
    const valPwd = new PasswordValidator(userData.password);

    if(valEmail.errors) return res.json(`email:${valEmail.errors}`);
    if(valName.errors) return res.json(`name:${valName.errors}`);
    if(valPwd.errors) return res.json(`password:${valPwd.errors}`);

    const registerdUserData : RegisterdUserData = {
        id: uuid(),
        email: userData.email,
        name: userData.name
    };

    return res.json(registerdUserData);   
}



async function logoutUser(req : Request, res : Response) {
    try {
        res.cookie('auth', false,{ maxAge: 15, httpOnly: false });
        res.status(200).json({data: "ok"});   
    }
    catch(e: any){
        res.status(500).json({message: e.message});
    }   
}


function generateAccessToken(_user_id : userId) {   
    if (JWT_SECRET) {

        return jwt.sign(_user_id, JWT_SECRET, { expiresIn: '7200s' });
    } else {
        throw new Error('Error generating token');
    }   
}  



export { getUUID, login, update };