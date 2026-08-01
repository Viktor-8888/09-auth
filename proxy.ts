import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseCookie } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (accessToken === undefined) {
    if (refreshToken !== undefined) {
      const { headers } = await checkSession();

      const setCookie = headers['set-cookie'];

      if (setCookie !== undefined) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieString of cookieArray) {
          const parsed = parseCookie(cookieString);

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
          };

          if (parsed.accessToken !== undefined) {
            cookieStore.set('accessToken', parsed.accessToken, options);
          }

          if (parsed.refreshToken !== undefined) {
            cookieStore.set('refreshToken', parsed.refreshToken, options);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }

        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  } else {
    if (isPrivateRoute) {
      return NextResponse.next();
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
