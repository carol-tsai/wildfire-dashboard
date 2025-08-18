CREATE EXTERNAL TABLE IF NOT EXISTS `wildfire_db4`.`firedata` (
  `objectid` double,
  `globalid` string,
  `fireoccurid` string,
  `revdate` timestamp,
  `firename` timestamp,
  `fireyear` int,
  `discoverydatetime` timestamp,
  `sizeclass` string,
  `totalacres` double,
  `statcause` string,
  `fireoutdatetime` string,
  `latdd83` double,
  `longdd83` double,
  `firetypecategory` string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
WITH SERDEPROPERTIES ('field.delim' = ',')
STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 's3://wildfire-data2/data/'
TBLPROPERTIES ('classification' = 'csv');