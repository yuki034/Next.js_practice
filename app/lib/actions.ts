'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import bcrypt from 'bcryptjs';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  //フォームから送られてくるのは基本的に文字列なのでcoerceで型変換（型を強制しています）してます
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),//0より大きい数値を入力しないとエラーが発生します
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});


const CreateInvoice = FormSchema.omit({ id: true, date: true });//idとdateを除外します
const UpdateInvoice = FormSchema.omit({ id: true, date: true });//idとdateを除外します

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
});

 // フォームの検証に失敗した場合、エラーを早期に返します。それ以外の場合は続行します。
if (!validatedFields.success) {
  return {
    errors: validatedFields.error.flatten().fieldErrors,
    message: 'Missing Fields. Failed to Create Invoice.',
  };
}

const { customerId, amount, status } = validatedFields.data;//フォームから送られてくるデータを取得します
const amountInCents = amount * 100;//セントに変換します
const date = new Date().toISOString().split('T')[0];//日付を取得します

try{
  //データベースにデータを挿入します
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
} catch (error) {
// データベースエラーが発生した場合、より具体的なエラーを返します。
console.error('Error create invoice:', error);
return {
  message: 'Database Error: Failed to Create Invoice.',
  };
}
  // インボイスページのキャッシュを再検証し、ユーザーをリダイレクトします。
revalidatePath('/dashboard/invoices');
redirect('/dashboard/invoices');
}

export async function updateInvoice(
   id: string,
   prevState: State,
   formData: FormData,
  ) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

try{
  await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
      `;
    } catch (error) {
      console.error('Error updating invoice:', error);
      return { message: 'Database Error: Failed to Update Invoice.' };
  }

revalidatePath('/dashboard/invoices');
redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  //Unreachable code block
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function deleteUsers(id: string) {
  'use server';
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete user.');
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log('--- authenticate Server Action Started ---');
  try {
    await signIn('credentials', formData);
  } catch (error) {
    // error.nameでエラーの種類を判定する
    if ((error as Error).name === 'CredentialsSignin') {
      return 'Invalid credentials.';
    }
    // 他の予期せぬエラーはそのままスローする
    throw error;
  }
}
//新しいユーザーを作ってDBに保存します
export async function createUser(id: string, name: string, email: string, password: string) {
  'use server';
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword:', hashedPassword);
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${id}, ${name}, ${email}, ${password})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create user.');
  }
}

export async function updateUsers(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email) {
    return {
      message: 'NameとE-mailは必須です。',
    };
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, password = ${hashedPassword}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return { message: 'Database Error: Failed to Update User.' };
  }

  revalidatePath('/dashboard/Users');
  redirect('/dashboard/Users');
}