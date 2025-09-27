-- Fix the security issue: Restrict profile visibility to user's own data only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy: users can only view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep existing policies for insert and update (they're already secure)
-- Users can insert their own profile: auth.uid() = user_id ✓
-- Users can update their own profile: auth.uid() = user_id ✓