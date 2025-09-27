-- Make the current user an admin (you'll need to replace with your actual user ID after first login)
-- This is a placeholder - we'll update this after you sign in

-- Create a trigger to automatically make the first user an admin
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    -- Make this user an admin
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;