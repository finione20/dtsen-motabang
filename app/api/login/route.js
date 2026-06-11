import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT * FROM operator WHERE username = $1 LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const operator = rows[0];
    const isPasswordValid = await bcrypt.compare(password, operator.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const token = generateToken();

    global.operatorSessions = global.operatorSessions || {};
    global.operatorSessions[token] = {
      username: operator.username,
      operatorId: operator.id,
      loginTime: new Date(),
    };

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      token,
    });
  } catch (error) {
    console.error('❌ Error di API login:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Metode GET tidak diizinkan' },
    { status: 405 }
  );
}