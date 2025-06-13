import postgres from 'postgres';
import { NextResponse } from 'next/server';

// 【重要】
// このAPIルートはデータベース構造の更新に一度だけ使います。
// 成功したら、セキュリティのために必ずこのファイルを削除してください。

export async function GET() {
  const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Altering table "users" to add "is_admin" column...');
    
    // usersテーブルにis_adminカラムを追加するSQLコマンドを実行
    await sql`
      ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
    `;
    
    console.log('Table altered successfully.');
    
    return NextResponse.json({ message: 'usersテーブルの更新に成功しました。is_adminカラムが追加されました。' });

  } catch (error: any) {
    // もしカラムが既に存在している場合は、エラーではなく成功メッセージを返す
    if (error.code === '42701') { // 42701は「duplicate_column」のエラーコード
      console.log('Column "is_admin" already exists.');
      return NextResponse.json({ message: 'is_adminカラムは既に存在します。' });
    }
    
    console.error('Failed to alter table:', error);
    return NextResponse.json(
      { message: 'テーブルの更新に失敗しました。', error },
      { status: 500 }
    );
  }
}