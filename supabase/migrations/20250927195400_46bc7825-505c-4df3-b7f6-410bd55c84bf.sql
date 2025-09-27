-- Fix the security issue by setting the search_path properly
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;