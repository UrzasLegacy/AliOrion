=QUERY(Dataset!A:V,
    
    "WHERE A IS NOT NULL"

    &IF($B$2=TRUE," AND LOWER(A) CONTAINS 'ring'","")
    &IF($B$3=TRUE," AND LOWER(A) CONTAINS 'bracelet'","")

    &IFERROR(" AND LOWER(B) CONTAINS '"&JOIN("' AND LOWER(B) CONTAINS '",FILTER(LOWER($D$2:$D$6),$E$2:$E$6))&"'")
    &IFERROR(" AND LOWER(C) CONTAINS '"&JOIN("' AND LOWER(C) CONTAINS '",FILTER(LOWER($D$8:$D$12),$E$8:$E$12))&"'")
    &IFERROR(" AND LOWER(D) CONTAINS '"&JOIN("' AND LOWER(D) CONTAINS '",FILTER(LOWER($D$14:$D$19),$E$14:$E$19))&"'")
    &IFERROR(" AND LOWER(E) CONTAINS '"&JOIN("' AND LOWER(E) CONTAINS '",FILTER(LOWER($D$21:$D$27),$E$21:$E$27))&"'")
    &IFERROR(" AND LOWER(F) CONTAINS '"&JOIN("' AND LOWER(F) CONTAINS '",FILTER(LOWER($D$29:$D$35),$E$29:$E$35))&"'")

    &IF($H$2=TRUE," AND G >= 0","")
    &IF($H$3=TRUE," AND H >= 0","")
    &IF($H$4=TRUE," AND I >= 0","")
    &IF($H$5=TRUE," AND J >= 0","")
    &IF($H$6=TRUE," AND K >= 0","")
    &IF($H$7=TRUE," AND L >= 0","")
    &IF($H$8=TRUE," AND M >= 0","")
    &IF($H$9=TRUE," AND N >= 0","")
    &IF($H$10=TRUE," AND O >= 0","")
    &IF($H$11=TRUE," AND P >= 0","")
    &IF($H$12=TRUE," AND Q >= 0","")
    &IF($H$13=TRUE," AND R >= 0","")
    &IF($H$14=TRUE," AND S >= 0","")
    &IF($H$15=TRUE," AND T >= 0","")
    &IF($H$16=TRUE," AND U >= 0","")
    &IF($H$17=TRUE," AND V >= 0","")
  
    ,1)
