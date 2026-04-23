'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Shield, Users } from 'lucide-react';

export default function PortalLandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: '#f5f9f7' }}>

      {/* Subtle radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(193,154,91,0.05) 0%, transparent 60%)',
      }} />

      <div className="relative w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center mb-14">
          <Image src="/logo.png" alt="Apex & Origin" width={360} height={126} className="h-auto w-full max-w-xs" priority />
        </div>

        {/* Entry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Internal */}
          <Link href="/portal/login" className="group block outline-none">
            <div className="h-full p-8 rounded-2xl transition-all duration-200"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(93,171,121,0.18)',
                boxShadow: '0 2px 16px rgba(10,15,28,0.05)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 28px rgba(10,15,28,0.1)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(193,154,91,0.35)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(10,15,28,0.05)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(93,171,121,0.18)';
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(193,154,91,0.15), rgba(93,171,121,0.06))',
                  border: '1px solid rgba(193,154,91,0.22)',
                }}>
                <Shield size={20} style={{ color: 'var(--portal-gold-600)' }} />
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 6, margin: '0 0 6px' }}>
                Internal
              </h2>
              <p style={{ fontSize: 13, color: '#6b9a7d', lineHeight: 1.6, margin: 0 }}>
                Staff, administrators &amp; practitioners
              </p>
            </div>
          </Link>

          {/* Program Participants */}
          <Link href="/programs" className="group block outline-none">
            <div className="h-full p-8 rounded-2xl transition-all duration-200"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(93,171,121,0.18)',
                boxShadow: '0 2px 16px rgba(10,15,28,0.05)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 28px rgba(10,15,28,0.1)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(93,171,121,0.35)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(10,15,28,0.05)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(93,171,121,0.18)';
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(93,171,121,0.12), rgba(93,171,121,0.04))',
                  border: '1px solid rgba(93,171,121,0.2)',
                }}>
                <Users size={20} style={{ color: '#5dab79' }} />
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: '#1a3a2a', fontFamily: "'DM Serif Display', serif", marginBottom: 6, margin: '0 0 6px' }}>
                Program Participants
              </h2>
              <p style={{ fontSize: 13, color: '#6b9a7d', lineHeight: 1.6, margin: 0 }}>
                Register for your leadership program
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
