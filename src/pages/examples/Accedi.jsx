import React from 'react'
import Button from '@/components/ui/Button.jsx'
import { Input } from '@/components/ui/Input.jsx'
import { Select } from '@/components/ui/Select.jsx'
import { IconBrandGithub, IconBrandGoogle, IconBrandApple } from '@tabler/icons-react'

export default function Accedi() {
  return (
    <div className="min-h-screen bg-grain flex items-center justify-center p-6">
      <div className="w-full max-w-md card">
        <div className="mb-4 text-center">
          <img src="/logo-core.svg" alt="CORE" className="h-10 mx-auto mb-3" />
          <h1 className="h2">Se connecter à CORE</h1>
          <p className="text-neutral-100/70">Accédez à vos équipes et rapports</p>
        </div>

        <div className="grid gap-3 mb-4">
          <Button className="w-full" variant="outline"><IconBrandGoogle className="mr-2" /> Continuer avec Google</Button>
          <Button className="w-full" variant="outline"><IconBrandApple className="mr-2" /> Continuer avec Apple</Button>
          <Button className="w-full" variant="outline"><IconBrandGithub className="mr-2" /> Continuer avec Github</Button>
        </div>

        <div className="relative my-4 text-center text-sm text-neutral-100/60">
          <span className="px-2 bg-white relative z-10">ou</span>
          <div className="absolute inset-0 top-1/2 -z-0 border-t border-neutral-25"></div>
        </div>

        <form className="grid gap-3">
          <Input placeholder="Email" type="email" required />
          <Input placeholder="Mot de passe" type="password" required />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-neutral-100/80">Langue</label>
            <Select>
              <option>Italiano</option>
              <option>Français</option>
              <option>English</option>
            </Select>
          </div>
          <Button type="submit" className="w-full">Se connecter</Button>
          <p className="text-xs text-neutral-100/60 text-center">Statut service: opérationnel</p>
        </form>
      </div>
    </div>
  )
}
