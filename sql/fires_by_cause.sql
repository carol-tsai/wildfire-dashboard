SELECT statcause, COUNT(*) AS fire_count
FROM wildfire_db4.firedata
GROUP BY statcause
ORDER BY fire_count desc;