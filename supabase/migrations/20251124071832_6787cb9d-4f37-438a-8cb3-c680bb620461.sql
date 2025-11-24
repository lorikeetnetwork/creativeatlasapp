-- Grant admin role to samchiltonmusicbusiness@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'samchiltonmusicbusiness@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;