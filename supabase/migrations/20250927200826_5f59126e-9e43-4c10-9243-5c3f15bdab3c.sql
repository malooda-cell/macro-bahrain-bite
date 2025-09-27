-- Update the function to make both first and second users admins
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if there are fewer than 2 admin users
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') < 2 THEN
    -- Make this user an admin (for first and second users)
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;