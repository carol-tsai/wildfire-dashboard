SELECT statcause, AVG(totalacres) AS avg_acres
FROM wildfire_db4.firedata
where fireyear > 1973 and fireyear<2024
GROUP BY statcause
ORDER BY avg_acres desc;