import { supabase } from "@/lib/supabaseClient";
import jwt from 'jsonwebtoken';

function authenticate(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired', status: 401 };
    }
    return { error: 'Invalid token', status: 401 };
  }
}

export async function POST(request) {
    const auth = authenticate(request);
    if (auth.error) {
        return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
    }
    try {
        const { key, value, note, id } = await request.json();
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        const trimmedNote = note.trim();
        const trimmedId = id ? id.trim() : null;
        if (!trimmedId) {
            const { data, error } = await supabase.from("data").insert([
                { 
                    data_key: trimmedKey, 
                    data_value: trimmedValue, 
                    data_note: trimmedNote,
                    userid: auth.user.id,
                    created_at: new Date().toISOString()
                }
            ]);

            if (error) {
                throw error;
            }
        }else {
            const { data, error } = await supabase.from("data").update({
                data_key: trimmedKey,
                data_value: trimmedValue,
                data_note: trimmedNote,
                userid: auth.user.id,
            }).eq("id", trimmedId);

            if (error) {
                throw error;
            }
        }

        return new Response(JSON.stringify({ message: 'Data added successfully' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add data', details: error.message }), { status: 400 });
    }
    
}

export async function GET(request) {
    const auth = authenticate(request);
    if (auth.error) {
        return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
    }
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        let query = supabase
            .from("data")
            .select("*")
            .eq("id", id || null)
            .order("created_at", { ascending: false });

        if (id) {
            query = query.eq("userid", auth.user.id);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data', details: error.message }), { status: 400 });
    }
}

export async function DELETE(request) {
    const auth = authenticate(request);
    if (auth.error) {
        return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
    }
    try {
        const { id } = await request.json();
        const trimmedId = id.trim();
        const userId = auth.user.id;
        const { error } = await supabase
            .from("data")
            .delete()
            .eq("id", trimmedId)
            .eq("userid", userId);

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete data', details: error.message }), { status: 400 });
    }
}