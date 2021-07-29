for name in `ls | grep json`; do sed -i -e 's/$1/doslab/g' $name; done
