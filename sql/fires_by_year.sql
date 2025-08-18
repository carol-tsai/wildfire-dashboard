SELECT fireyear, COUNT(*) AS fire_count
FROM wildfire_db4.firedata
where fireyear > 1973 and fireyear<2024
GROUP BY fireyear
ORDER BY fireyear desc;