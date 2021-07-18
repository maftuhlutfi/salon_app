const navList = {
    admin: [
        {
            title: 'Produk',
            href: '/produk',
            icon: 'icon-archive'
        },
        {
            title: 'Kategori',
            href: '/kategori',
            icon: 'icon-grid'
        },
        {
            title: 'Transaksi',
            href: '/transaksi',
            icon: 'icon-repeat'
        },
        {
            title: 'Laporan',
            href: '/laporan',
            icon: 'icon-doc',
            subMenu: [
                {
                    title: 'Transaksi',
                    href: '/laporan/laporan-transaksi'
                },
                {
                    title: 'Penjualan',
                    href: '/laporan/laporan-penjualan'
                }
            ]
        },
        {
            title: 'Pelanggan',
            href: '/pelanggan',
            icon: 'icon-users'
        },
        {
            title: 'Akun Admin',
            href: '/akun-admin',
            icon: 'icon-user'
        }
    ],
    pelanggan: [
        {
            title: 'Produk',
            href: '/produk',
            icon: 'icon-archive'
        },
        {
            title: 'Transaksi',
            href: '/transaksi',
            icon: 'icon-repeat'
        }
    ]
}

export default navList