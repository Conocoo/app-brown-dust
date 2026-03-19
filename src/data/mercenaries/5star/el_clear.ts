import type { MercenaryTemplate } from '../../../types/mercenary'

export const el_clear: MercenaryTemplate = {
  id: 'el_clear',
  name: '엘 클리어',
  type: 'attacker',
  star: 5,
  maxHp: 6530,
  atk: 16,
  def: 25,
  emoji: '⚔️',
  imageId: '4515',
  critRate: 0,
  critDamage: 0,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_down', value: 200, duration: 200, debuffClass: 'stat_weaken' },
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
