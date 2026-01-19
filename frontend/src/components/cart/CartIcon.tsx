import Link from 'next/link'
import { useTranslations } from 'next-intl';

export function CartIcon() {
  const t = useTranslations();

  const cartItemsCount = 3 //! mock data

  return (
    <Link href="/cart">
      <div>
        <span>{t('Cart.cart')} 🛒</span>
        {cartItemsCount > 0 && (<span>{cartItemsCount}</span>)}
      </div>
    </Link>
  )
}