import React from 'react';
import styles from './GroupListPage.module.scss';

const GroupListPage = () => {
  // Danh sách nhóm người dùng đã tham gia
  const joinedGroups = [
    {
      name: 'GIAO THÔNG ĐƯỜNG BỘ 24h',
      lastActive: '3 ngày trước',
      imageUrl: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.30497-1/116687302_959241714549285_318408173653384421_n.jpg?stp=cp0_dst-jpg_s80x80_tt6&_nc_cat=1&ccb=1-7&_nc_sid=100df4&_nc_eui2=AeHt4BBwUnjx0FQbIfhPOhYlU2VttAho9CNTZW20CGj0I7w4vf6l43KgcFHLAwYoDTXYGfEnICFdyvIB0gtgk_b5&_nc_ohc=-FT3m7F4FrIQ7kNvgHRhVXY&_nc_oc=AdhVRoLVaTzw52iNLNwV-CpXUWwZu5jIte84LXT3kPrTwgE3ZpQdICqEl-0YmYsBxB3mRS0fncc8wykwxpXZ9UMf&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=AogRn2fICdvVFzcOPsbyR-j&oh=00_AYAZ_blMS_hOo_AbyfdM4MkbpIznnFQ47EtK-AfSTNHJWA&oe=678C63C3',
    },
    {
      name: 'Hội Ricon Việt Nam',
      lastActive: '6 tuần trước',
      imageUrl: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.30497-1/116687302_959241714549285_318408173653384421_n.jpg?stp=cp0_dst-jpg_s80x80_tt6&_nc_cat=1&ccb=1-7&_nc_sid=100df4&_nc_eui2=AeHt4BBwUnjx0FQbIfhPOhYlU2VttAho9CNTZW20CGj0I7w4vf6l43KgcFHLAwYoDTXYGfEnICFdyvIB0gtgk_b5&_nc_ohc=-FT3m7F4FrIQ7kNvgHRhVXY&_nc_oc=AdhVRoLVaTzw52iNLNwV-CpXUWwZu5jIte84LXT3kPrTwgE3ZpQdICqEl-0YmYsBxB3mRS0fncc8wykwxpXZ9UMf&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=AogRn2fICdvVFzcOPsbyR-j&oh=00_AYAZ_blMS_hOo_AbyfdM4MkbpIznnFQ47EtK-AfSTNHJWA&oe=678C63C3',
    },
    {
      name: '66IT4 HUCE',
      lastActive: '8 tuần trước',
      imageUrl: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.30497-1/116687302_959241714549285_318408173653384421_n.jpg?stp=cp0_dst-jpg_s80x80_tt6&_nc_cat=1&ccb=1-7&_nc_sid=100df4&_nc_eui2=AeHt4BBwUnjx0FQbIfhPOhYlU2VttAho9CNTZW20CGj0I7w4vf6l43KgcFHLAwYoDTXYGfEnICFdyvIB0gtgk_b5&_nc_ohc=-FT3m7F4FrIQ7kNvgHRhVXY&_nc_oc=AdhVRoLVaTzw52iNLNwV-CpXUWwZu5jIte84LXT3kPrTwgE3ZpQdICqEl-0YmYsBxB3mRS0fncc8wykwxpXZ9UMf&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=AogRn2fICdvVFzcOPsbyR-j&oh=00_AYAZ_blMS_hOo_AbyfdM4MkbpIznnFQ47EtK-AfSTNHJWA&oe=678C63C3',
    },
    {
      name: 'Brawlhalla Việt Nam',
      lastActive: '9 tuần trước',
      imageUrl: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t1.30497-1/116687302_959241714549285_318408173653384421_n.jpg?stp=cp0_dst-jpg_s80x80_tt6&_nc_cat=1&ccb=1-7&_nc_sid=100df4&_nc_eui2=AeHt4BBwUnjx0FQbIfhPOhYlU2VttAho9CNTZW20CGj0I7w4vf6l43KgcFHLAwYoDTXYGfEnICFdyvIB0gtgk_b5&_nc_ohc=-FT3m7F4FrIQ7kNvgHRhVXY&_nc_oc=AdhVRoLVaTzw52iNLNwV-CpXUWwZu5jIte84LXT3kPrTwgE3ZpQdICqEl-0YmYsBxB3mRS0fncc8wykwxpXZ9UMf&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=AogRn2fICdvVFzcOPsbyR-j&oh=00_AYAZ_blMS_hOo_AbyfdM4MkbpIznnFQ47EtK-AfSTNHJWA&oe=678C63C3',
    },
  ];

  return (
    <div className={styles['group-list-container']}>
      <h3 style={{ marginBottom: '20px', marginTop: '30px' }}>Tất cả các nhóm bạn đã tham gia ({joinedGroups.length})</h3>
      <div className={styles['group-grid']}>
        {joinedGroups.map((group, index) => (
          <div key={index} className={styles['group-card']}>
            <img src={group.imageUrl} alt={group.name} className={styles['group-image']} />
            <div className={styles['group-info']}>
              <h3 style={{ fontWeight: 'bold' }}>{group.name}</h3>
              <p>Lần truy cập gần đây nhất: {group.lastActive}</p>
              <button className={styles['view-button']}>Xem nhóm</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupListPage;
