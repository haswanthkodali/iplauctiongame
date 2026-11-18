-- ============================================================================
-- IPL AUCTION GAME - SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Create Auction Rooms Table
CREATE TABLE IF NOT EXISTS auctions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'TATA IPL 2027 Auction',
    status TEXT NOT NULL DEFAULT 'active', -- 'lobby', 'active', 'ended'
    mode TEXT NOT NULL DEFAULT 'MINI',     -- 'MINI' or 'MEGA'
    current_player_index INTEGER DEFAULT 0,
    current_bid NUMERIC DEFAULT 0,
    current_bidder TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id TEXT NOT NULL,
    auction_id TEXT NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    purse NUMERIC NOT NULL DEFAULT 120.0,
    spent NUMERIC NOT NULL DEFAULT 0.0,
    manager_name TEXT DEFAULT 'AI Owner',
    is_human BOOLEAN DEFAULT FALSE,
    players JSONB DEFAULT '[]'::jsonb,
    PRIMARY KEY (id, auction_id)
);

-- 3. Create Real-Time Bids Table
CREATE TABLE IF NOT EXISTS bids (
    id BIGSERIAL PRIMARY KEY,
    auction_id TEXT NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    team_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    past_bids JSONB DEFAULT '[]'::jsonb,
    past_ratings JSONB DEFAULT '{}'::jsonb,
    past_squads JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) & Public Read/Write for Game Clients
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on auctions" ON auctions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on auctions" ON auctions FOR ALL USING (true);

CREATE POLICY "Allow public read on teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on teams" ON teams FOR ALL USING (true);

CREATE POLICY "Allow public read on bids" ON bids FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bids" ON bids FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on profiles" ON profiles FOR ALL USING (true);

-- 6. Enable Supabase Realtime Broadcast & Listen for bids table
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;

-- 7. Insert Default Auction Room
INSERT INTO auctions (id, name, status, mode)
VALUES ('DEFAULT', 'TATA IPL 2027 Official Mini Auction', 'active', 'MINI')
ON CONFLICT (id) DO NOTHING;
